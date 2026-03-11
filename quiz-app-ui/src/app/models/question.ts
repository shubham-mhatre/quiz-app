import { Option } from "./option";

export interface Question {
  id?: number;
  topicId?: number;
  questionText: string;
  questionType: 'SINGLE' | 'MULTIPLE';
  options: Option[];
  explanation: string;
  message:string;
}
