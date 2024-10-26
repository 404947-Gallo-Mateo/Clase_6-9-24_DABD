import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";


export const roleGuard : CanActivateFn = (route , state) => {
    const auth = inject(AuthService)
    const router = inject(Router)
    

    const roleExpected = route.data['role']
    const role = auth.getRole()
    
    if(role === 'ADMIN'|| role === roleExpected ){
        return true
    }
    return router.navigate(['/access-denied'])

} 