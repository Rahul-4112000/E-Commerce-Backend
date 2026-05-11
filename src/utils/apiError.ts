export class ApiError extends Error {

    public statusCode:number

    constructor(statusCode: number,message:string){
        super('something went wrong');
        this.statusCode = statusCode,
        this.message = message
    }
}