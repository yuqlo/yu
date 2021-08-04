import { useContext } from 'react';
import { DispatchContext } from 'src/contexts/DispatchContext';

export const useDispatch = () => {
  const dispatch = useContext(DispatchContext);
  if (dispatch === null) throw new Error('');
  return dispatch;
};
