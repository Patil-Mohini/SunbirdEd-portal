import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { NotesService } from '../../services';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { response } from './note-form-component.spec.data';
import { NoteFormComponent } from './note-form.component';

describe('NoteFormComponent', () => {
  let component: NoteFormComponent;
  let fixture: ComponentFixture<NoteFormComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ 'courseId': 'do_212347136096788480178', 'contentId': 'do_2123229899264573441612' }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule, SharedModule, CoreModule],
      declarations: [NoteFormComponent],
      providers: [UserService, ResourceService, ToasterService, NotesService,
         LearnerService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFormComponent);
    component = fixture.componentInstance;
    spyOn(component, 'ngAfterViewInit');
    fixture.detectChanges();
  });


  it('Should subscribe to note service while creating a note', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(component.createEventEmitter, 'emit');
    spyOn(learnerService, 'get').and.returnValue(Observable.of(response.userSuccess));
    spyOn(notesService, 'create').and.returnValue(Observable.of(response.successResponse));
    userService.getUserProfile();
    component.createNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.createEventEmitter.emit).toHaveBeenCalled();
  });

  it('Should throw error from API response - create API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw({}));
    spyOn(notesService, 'create').and.callFake(() => Observable.throw(response.errResponse));
    userService.getUserProfile();
    component.createNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0030);
  });

  it('Should subscribe to note service while updating a note', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(component.updateEventEmitter, 'emit');
    spyOn(notesService, 'search').and.callFake(() => Observable.throw(response.searchSuccess));
    spyOn(learnerService, 'get').and.returnValue(Observable.of(response.userSuccess));
    spyOn(notesService, 'update').and.returnValue(Observable.of(response.successResponse));
    userService.getUserProfile();
    component.updateNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.updateEventEmitter.emit).toHaveBeenCalled();
  });

  it('Should throw error from API response - update API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(notesService, 'search').and.callFake(() => Observable.throw(response.searchSuccess));
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw({}));
    spyOn(notesService, 'update').and.callFake(() => Observable.throw(response.errResponse));
    userService.getUserProfile();
    component.updateNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0034);
  });

  it('Should clear values from title and description', () => {
    component.clearNote();
    expect(component.noteData.title).toBe('');
    expect(component.noteData.note).toBe('');
  });

});
