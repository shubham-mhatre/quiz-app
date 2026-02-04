import { Option } from "./option";

export interface Question {
  id?: number;
  topicId?: number;
  questionText: string;
  questionType: 'SINGLE' | 'MULTI';
  options: Option[];
  explanation: string;
}
