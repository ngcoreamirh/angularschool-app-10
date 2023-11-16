import { ICourse } from "./cource.interface";
import { IStudent } from "./student.interface";

// یه قرارداد وجود داره که قبل از اسم اینترفیس یه آی بزاریم
export interface IScore {
    ID?: string;
    student: IStudent;
    course: ICourse; // از نوع اینترفیسی که ساختیم
    scoreNumber: number;
}