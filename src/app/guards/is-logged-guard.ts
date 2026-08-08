import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
   const router =inject(Router)
  if(localStorage.getItem('userToken')!==null){
    router.navigate(['home'])
    return false
  }
  else{
    return true
  }
};

