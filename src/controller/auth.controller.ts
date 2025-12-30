import { Request,Response } from "express"
import { db } from "../config/firebaseConfig"

export const logout=async(req:Request,res:Response)=>{
    try{
        const {uid}=req.params
        if(!uid){
            return res.status(400).json({success:false,message:"User id is required"})
        }

        const userRef= db.collection("users").doc(uid);
        await userRef.update({
            status:"offline",
            connectedWith:null,
            connectionId:null
        });

        try{

            const onlineUserCollection=db.collection("onlineUser").doc(uid);
            await onlineUserCollection.delete()
        }catch(error:any){
            console.log("user not found in online users")
        }


        const connRef=db.collection("connections").where("userIds","array-contains",uid)
        const connSnapshot=await connRef.get()
        if(!connSnapshot.empty){
            const conDoc=connSnapshot.docs[0]
            await conDoc.ref.delete()
        }

        return res.status(200).json({success:true,message:"User logged out successfully"})
    }catch(error:any){
        return res.status(500).json({success:false,message:error.message})
    }
}