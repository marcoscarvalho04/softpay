export class PaymentOrderDTO{
    constructor(
    public merchantId: number,
    public value: number,
    public description: string){

    }
}