import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { MUTATION_ADD_REPLY, MUTATION_ADD_COMMENT } from '@app/shared/mutations/user-mutations';
import {
  QUERY_FETCH_PUBLIC_PROJECT_COMMENTS,
  QUERY_FETCH_ISSUE_COMMENTS,
  QUERY_FETCH_ONGIONG_PROJECT_COMMENTS
} from '@app/shared/queries/project-queries';
import { MUTATION_REPORT_COMMENT } from '@app/shared/mutations/project-mutations';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  loggedInUserId: string;

  constructor(private apollo: Apollo, authService: AuthenticationService) {
    this.loggedInUserId = authService.user_id;
  }

  /**
   * fetchComments
   */
  public fetchComments(activityId: number, activityType: string) {
    let Query = QUERY_FETCH_PUBLIC_PROJECT_COMMENTS;
    const variableQueryObject = {};
    switch (activityType) {
      case 'project':
        Query = QUERY_FETCH_ONGIONG_PROJECT_COMMENTS;
        variableQueryObject['projectId'] = activityId;
        break;
      case 'launched_project':
        Query = QUERY_FETCH_PUBLIC_PROJECT_COMMENTS;
        variableQueryObject['projectId'] = activityId;
        break;
      case 'issue':
        Query = QUERY_FETCH_ISSUE_COMMENTS;
        variableQueryObject['issueId'] = activityId;
        break;
      default:
        break;
    }
    return this.apollo
      .watchQuery<any>({
        query: Query,
        variables: variableQueryObject
      })
      .valueChanges.pipe(take(1))
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  /**
   * addComment
   */
  public addComment(activityId: number, activityType: string, commentText: string) {
    const objectToBeAdded = {
      comment_text: commentText,
      commenter: this.loggedInUserId,
      previous_edits: '[]'
    };
    switch (activityType) {
      case 'launched_project':
        objectToBeAdded['launched_projects_id'] = activityId;
        break;
      case 'issue':
        objectToBeAdded['issue_id'] = activityId;
        break;
      default:
        break;
    }
    return this.apollo
      .mutate<any>({
        mutation: MUTATION_ADD_COMMENT,
        variables: {
          objects: objectToBeAdded
        }
      })
      .pipe(take(1))
      .pipe(res => {
        return res;
      });
  }

  /**
   * addReplyToComment
   */
  public addReplyToComment(replyText: string, commentId: number) {
    return this.apollo
      .mutate<any>({
        mutation: MUTATION_ADD_REPLY,
        variables: {
          objects: {
            reply_text: replyText,
            respondent: this.loggedInUserId,
            comment_id: commentId,
            previous_edits: []
          }
        }
      })
      .pipe(take(1))
      .pipe(res => {
        return res;
      });
  }

  /**
   * reportAComment
   */
  public reportAComment(commentId: number) {
    return this.apollo
      .mutate<any>({
        mutation: MUTATION_REPORT_COMMENT,
        variables: {
          userId: this.loggedInUserId,
          commentId: commentId
        }
      })
      .pipe(take(1))
      .pipe(res => {
        return res;
      });
  }
}
