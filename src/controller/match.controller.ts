import { Request, Response } from "express"
import { IUser } from "../types"
import { db } from "../config/firebaseConfig"

export const findMatch = async (req: Request, res: Response) => {
    try {

        const { uid } = req.params
        if (!uid) {
            return res.status(400).json({ success: false, message: "UID is required" })
        }

        const userRef = db.collection("users").doc(uid)
        const userSnapshot = await userRef.get()
        if (!userSnapshot.exists) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        const userData: Partial<IUser> = {
            id: uid,
            ...userSnapshot.data()
        }
        const userconnectedEmails = Array.isArray(userData.connectedEmails) ? userData.connectedEmails : []

        if (userData.connectionId && userData.connectedEmails) {
            const matchedUserSnap = await db.collection("users").doc(userData.connectedWith as string).get()
            return res.status(200).json({
                success: true, message: "already matched", data: {
                    matchUser: matchedUserSnap.exists ? { id: userData.connectedWith, ...matchedUserSnap.data() } : null,
                    connectionId: userData.connectionId
                }
            })
        }

        // fetch only online 
        const onlineUserSnapshot = await db.collection("onlineUser").where("status", "==", "online").get()
        if (onlineUserSnapshot.empty) {
            return res.status(400).json({ success: false, message: "No online users available for matching ", data: null })
        }


        const availableUsers: Partial<IUser>[] = onlineUserSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((user: Partial<IUser>) => user.id !== uid && !userconnectedEmails.includes(String(user.email)))
        if (availableUsers.length === 0) {
            return res.status(404).json({ success: false, message: "No available user for matching", data: null })
        }

        //pick random user
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        const connectionRef = await db.collection("connections").add({
            users: [uid, randomUser.id],
            createdAt: new Date()
        })
        const connectionId = connectionRef.id
        await Promise.all([
            db.collection("users").doc(uid).update({
                connectionId,
                connectedWith: randomUser.id,
                connectedEmails: randomUser.email ? [...userconnectedEmails, String(randomUser.email)] : userconnectedEmails
            }),
            db.collection("users").doc(randomUser.id as string).update({
                connectionId,
                connectedWith: uid,
                connectedEmails: userData.email ? [...(Array.isArray(randomUser.connectedEmails) ? randomUser.connectedEmails : []), String(userData.email)] : (Array.isArray(randomUser.connectedEmails) ? randomUser.connectedEmails : [])

            })
        ])

        await Promise.all([
            db.collection("onlineUser").doc(uid).update({ status: "matched" }),
            db.collection("onlineUser").doc(randomUser.id as string).update({ status: "matched" })

        ])

        return res.status(200).json({ success: true, message: "Match found", data: { matchedUser: randomUser, connectionId } })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message })
    }
}