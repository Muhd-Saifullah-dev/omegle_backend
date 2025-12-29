import { Request,Response } from "express";
import { db } from "../config/firebaseConfig";
import { IResponse } from "../types";


export const createUser=async(req:Request,res:Response)=>{
    try {
        const {displayName,uid,email}=req.body;

        if(!displayName|| !uid || !email){
            return res.status(400).json({message:"Missing required field ",success:false})
        }
        const userRef=db.collection("users").doc(uid)
        const onlineUserRef=db.collection("onlineUser").doc(uid)
        const docSnap=await userRef.get()


        let response:IResponse={
            success:true,
            message:"",
            data:null
        }

        if(docSnap.exists){
            await db.collection("users").doc(uid).update({
            status:"online",
            lastLogin:new Date()
            })
            response.message="user logged in successfully"
        }else{
            await db.collection("users").doc(uid).set({
                email,
                displayName,
                id:uid,
                status:"online",
                createdAt:new Date(),
                lastLogin:new Date(),
                connectedWith:null,
                connectedEmails:[],
                connectionId:null

            })
            response.message="user created successfully"
        }

        await onlineUserRef.set({
            uid,
            displayName,
            email,
            status:"online",
            lastLogin:new Date()
        })
        response.data={
            uid,
            displayName,
            email
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({message:"internal server error",success:false})
        
    }
}
