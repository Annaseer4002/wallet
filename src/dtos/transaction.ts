import { 
    IsEmail,
    IsString,
    IsNumber,
    IsEmpty,
    IsNotEmpty,
    
    
 } from "class-validator";


 export namespace TransactionDtos {
    export class Transfer {
        @IsString()
        @IsNotEmpty({ message: 'Receiver ID is required' })
        receiverId!: string;

        @IsNumber()
        @IsNotEmpty({ message: 'Amount must be number' })
        amount!: number;

    }
 }


 export default TransactionDtos