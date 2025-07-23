// hooks/useCheckout.js
"use client";
import { useDispatch, useSelector } from 'react-redux';
import { 
  proceedToNextStep, 
  goBackToStep,
  setCheckoutStatus,
  resetCheckout
} from '@/slice/checkoutSlice';

export function useCheckout() {
  const dispatch = useDispatch();
  const checkoutState = useSelector((state) => state.checkout);

  const handleProceed = (data) => {
    dispatch(proceedToNextStep(data));
  };

  const handleGoBack = (step) => {
    dispatch(goBackToStep(step));
  };

  const handleReset = () => {
    dispatch(resetCheckout());
  };

  const setStatus = (status) => {
    dispatch(setCheckoutStatus(status));
  };

  return {
    ...checkoutState,
    proceedToNextStep: handleProceed,
    goBackToStep: handleGoBack,
    resetCheckout: handleReset,
    setCheckoutStatus: setStatus
  };
}