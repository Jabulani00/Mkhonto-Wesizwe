import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
    
  },
  {
    path: 'stats',
    loadChildren: () => import('./stats/stats.module').then( m => m.StatsPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./super-admin/super-admin.module').then( m => m.SuperAdminPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'counter',
    loadChildren: () => import('./counter/counter.module').then( m => m.CounterPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'validation',
    loadChildren: () => import('./validation/validation.module').then( m => m.ValidationPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'municipality',
    loadChildren: () => import('./municipality/municipality.module').then( m => m.MunicipalityPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'region',
    loadChildren: () => import('./region/region.module').then( m => m.RegionPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'approve',
    loadChildren: () => import('./approve/approve.module').then( m => m.ApprovePageModule),
    canActivate: [AuthGuard] 
  },{
    path: 'election-results',
    loadChildren: () => import('./election-results/election-results.module').then( m => m.ElectionResultsPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'region-stats',
    loadChildren: () => import('./region-stats/region-stats.module').then(m => m.RegionStatsPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'vd',
    loadChildren: () => import('./vd/vd.module').then( m => m.VdPageModule),
    canActivate: [AuthGuard]  // Protect this route with the AuthGuard
  },
  {
    path: 'slip-take',
    loadChildren: () => import('./slip-take/slip-take.module').then( m => m.SlipTakePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'spoilt-votes',
    loadChildren: () => import('./spoilt-votes/spoilt-votes.module').then( m => m.SpoiltVotesPageModule),
    canActivate: [AuthGuard] 

  },  {
    path: 'upload-file',
    loadChildren: () => import('./upload-file/upload-file.module').then( m => m.UploadFilePageModule)
  },
  {
    path: 'get-doc',
    loadChildren: () => import('./get-doc/get-doc.module').then( m => m.GetDocPageModule)
  },





  
    

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
