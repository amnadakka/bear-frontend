import { Color } from './color.interface';

export interface Bear {
  id: number;
  name: string;
  size: number;
  colors: Color[];
}

export interface CreateBearRequest {
  name: string;
  size: number;
  colorIds: number[];
}
