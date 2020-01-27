import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { QuestionnairesService } from '../../questionnaires.service';
import { Questions } from '../../questions';

@Component({
  selector: 'app-questions-detail',
  templateUrl: './questions-detail.component.html',
  styleUrls: ['./questions-detail.component.css']
})
export class QuestionsDetailComponent implements OnInit {

  questionForm: FormGroup;
  questionSingle: Questions;
  reponses: FormArray;
  isDisplayed = false;

  constructor(
    private route: Router,
    private questionnairesService: QuestionnairesService,
    private road: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const idQuestion = this.road.snapshot.paramMap.get('idQuestion');
    this.questionnairesService.getSingleQuestion(idQuestion);
    this.questionnairesService.singleQuestionSubject.subscribe(data => {
      this.questionSingle = data;
      this.questionForm = this.formBuilder.group({
        question: [this.questionSingle.question, Validators.required],
        reponses: this.formBuilder.array(this.questionSingle.reponses, Validators.required),
        ordre: [this.questionSingle.ordre, Validators.required],
        active: [this.questionSingle.active, Validators.required]
      });
      this.isDisplayed = true;

    });
  }

  onClose() {
    this.route.navigate(['/questionnaires']);
  }

  onEditQuestion() {
    const data = this.questionForm.value as Questions;
    data.id = this.questionSingle.id;
    data.idOfQuestionnaire = this.questionSingle.idOfQuestionnaire;
    data.timestamp = new Date();
    console.log(data);
    this.questionnairesService.updateQuestion(data);
    this.route.navigate(['/questionnaires']);
  }

  onAddReponse() {
    const newReponse = this.formBuilder.control('', Validators.required);
    this.getReponses().push(newReponse);
  }

  getReponses(): FormArray {
    return this.questionForm.get('reponses') as FormArray;
  }

  removeReponse(i) {
    this.getReponses().removeAt(i);
  }

}
