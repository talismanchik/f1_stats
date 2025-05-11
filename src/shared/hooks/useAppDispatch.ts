import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store/index';

export const useAppDispatch = () => useDispatch<AppDispatch>(); 