export interface IResponse{
    success:boolean,
    message:string,
    data:any
}

export interface IUser{
    id:string,
    displayName:string,
    email:string,
    createdAt:Date,
    lastLogin:Date,
    status:"online" | "offline"| "matched",
    connectedEmails:string[],
    connectedWith:string | null,
    connectionId:string | null

}