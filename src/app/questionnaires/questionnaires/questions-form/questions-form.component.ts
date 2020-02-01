import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuestionnairesService } from '../../questionnaires.service';

@Component({
  selector: 'app-questions-form',
  templateUrl: './questions-form.component.html',
  styleUrls: ['./questions-form.component.css']
})
export class QuestionsFormComponent implements OnInit {

  questionForm: FormGroup;
  reponses: FormArray;
  numberReponse = 0;
  noOrdre: number;

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private questionnairesService: QuestionnairesService,
    private road: ActivatedRoute
    ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      reponses: this.formBuilder.array([], Validators.required),
      active: [false, Validators.required]
    });
    this.questionnairesService.getAllQuestions( this.road.snapshot.paramMap.get('idQuestionnaire') );
    this.questionnairesService.questionsListSubject.subscribe(data => {
      if (data) {
        this.noOrdre = data.length + 1;
      } else {
        this.noOrdre = 1;
      }
    });
  }

  onAddQuestion() {
    const idQuestionnaire = this.road.snapshot.paramMap.get('idQuestionnaire');
    const data = this.questionForm.value;
    data.ordre = this.noOrdre;
    console.log( data );
    this.questionnairesService.createQuestion(idQuestionnaire, data, new Date().getTime());
    this.initForm();
  }

  getReponses(): FormArray {
    return this.questionForm.get('reponses') as FormArray;
  }

  onAddReponse() {
    const newReponse = this.formBuilder.control('', Validators.required);
    this.getReponses().push(newReponse);
    this.numberReponse++;
  }

  removeReponse(i) {
    this.getReponses().removeAt(i);
    this.numberReponse--;
  }

  onClose() {
    this.route.navigate(['/questionnaires']);
  }

}
