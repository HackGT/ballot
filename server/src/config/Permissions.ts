import { User, UserRole } from '../entity/User';

export enum Role {
  Pending = 'Pending',
  Judge = 'Judge',
  Admin = 'Admin',
  Owner = 'Owner',
}

export enum Action {
  Reset = 'Reset',

  EditUser = 'EditUser',
  DeleteUser = 'DeleteUser',
  ViewUsers = 'ViewUsers',

  ViewCategories = 'ViewCategories',
  ViewCategoriesCriteria = 'ViewCategoriesCriteria',
  AddCategory = 'AddCategory',
  DeleteCategory = 'DeleteCategory',
  UpdateCategory = 'UpdateCategory',

  ManageTableGroups = 'ManageTableGroups',
  ViewTableGroups = 'ViewTableGroups',

  BatchUploadProjects = 'BatchUploadProjects',
  AddProject = 'AddProject',
  ImportProjects = 'ImportProjects',
  AcceptProjects = 'AcceptProjects',
  DeleteProject = 'DeleteProject',
  UpdateProject = 'UpdateProject',
  ViewProjects = 'ViewProjects',
  QueueProject = 'QueueProject',
  DequeueProject = 'DequeueProject',
  ChangeProjectRound = 'ChangeProjectRound',

  ViewBallot = 'ViewBallot',
  ScoreBallot = 'ScoreBallot',

  StartProject = 'StartProject',
  SkipProject = 'SkipProject',

  ViewRanking = 'ViewRanking',
}

export function can(user: User, action: Action): boolean {
  if (user) {
    switch (action) {
      case Action.Reset:
        return user.role === UserRole.Owner;
      case Action.EditUser:
      case Action.DeleteUser:
      case Action.ViewUsers:
      case Action.AddCategory:
      case Action.DeleteCategory:
      case Action.UpdateCategory:
      case Action.ManageTableGroups:
      case Action.QueueProject:
      case Action.DequeueProject:
      case Action.ChangeProjectRound:
      case Action.BatchUploadProjects:
      case Action.AddProject:
      case Action.ImportProjects:
      case Action.AcceptProjects:
      case Action.DeleteProject:
      case Action.UpdateProject:
        return user.role === UserRole.Owner
          || user.role === UserRole.Admin;
      case Action.ViewBallot:
      case Action.ScoreBallot:
      case Action.StartProject:
      case Action.SkipProject:
      case Action.ViewCategoriesCriteria:
        return user.role === UserRole.Owner
          || user.role === UserRole.Admin
          || user.role === UserRole.Judge;
      case Action.ViewProjects:
      case Action.ViewCategories:
      case Action.ViewTableGroups:
        return true;
    }
  } else {
    switch (action) {
      case Action.ViewProjects:
      case Action.ViewCategories:
      case Action.ViewTableGroups:
        return true;
      default:
        return false;
    }
  }

  return false;
}
