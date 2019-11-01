export class TransferDTO{
    constructor(
    public merchantOriginId: number,
    public value: number,
    public merchantDestinationId: number,
    public description: string){

    }
}