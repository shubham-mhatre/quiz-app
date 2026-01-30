import { Option } from "./option";

export interface Question {
  id?: number;
  topicId?: number;
  text: string;
  type: 'SINGLE' | 'MULTI';
  options: Option[];
  explanation: string;
}
