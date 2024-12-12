import { User } from '../user.model';

export interface State {
  user: User | null;
}
const initialState: State = {
  user: null,
};
export function authReducer(state = initialState, action: any) {
  return state;
}
