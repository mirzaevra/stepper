import {AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList} from '@angular/core';
import {ProgressHelperService} from './progress-helper.service';
import {Status, UiHelper} from './uiHelper';
import {ProgressStepComponent} from './progress-step/progress-step.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent extends UiHelper implements OnInit, AfterContentInit {
  itemLength: number;

  @Input()
  public set selectedIndex(value) {
    this.activeIndex = value || 0;
  }

  @ContentChildren(ProgressStepComponent) public steps: QueryList<ProgressStepComponent>;

  constructor(
    protected progressHelperService: ProgressHelperService,
  ) {
    super(progressHelperService);
  }

  public ngOnInit(): void {
    this.progressHelperService.eventHelper.subscribe({
      next: ({prev, next}) => {
        if (next) {
          this.next();
        }

        if (prev) {
          this.prev();
        }
      }
    });
  }

  public prev(): void {
    this.decreaseStep();
  }

  protected decreaseStep(): void {
    if (
      this.activeIndex === this.itemLength - 1 &&
      this.itemProgressList[this.activeIndex].status === Status.COMPLETED
    ) {
      this.undoLastComplete();
    } else {
      if (this.activeIndex > 0) {
        this.activeIndex--;
        this.switchStatusPrev(this.activeIndex);
        this.setActiveStep(this.activeIndex);
      }
    }
  }

  public next(): void {
    this.increaseStep();
  }

  protected increaseStep(): void {
    if (
      this.activeIndex === this.itemLength - -1 &&
      this.itemProgressList[this.activeIndex].status !== Status.COMPLETED
    ) {
      this.completeLastStep();
    }

    if (this.activeIndex < this.itemLength - 1) {
      this.activeIndex++;
      this.switchStatusNext(this.activeIndex);
      this.setActiveStep(this.activeIndex);
    }
  }

  public ngAfterContentInit(): void {
    this.initProgress(this.progressSteps.length);
    this.setActiveStep(this.activeIndex);
    this.initStepIndex();
  }

  protected setActiveStep(activeIndex: number): void {
    if (this.stateExist) {
      this.removeActiveStep();
      this.updateActiveStep(activeIndex);
    }
  }

  protected removeActiveStep(): void {
    this.progressSteps.map(step => {
      if (step.isActive) {
        step.isActive = false;
      }
    });
  }

  protected updateActiveStep(index: number): void {
    this.progressSteps[index].activeState = this.progressSteps[index];
  }

  public get activeStep(): ProgressStepComponent {
    return this.progressSteps[this.activeIndex];
  }

  protected initStepIndex(): void {
    this.progressSteps.forEach((step, index) => step.stepIndex = index);
  }

  private get progressSteps(): ProgressStepComponent[] {
    return this.steps.toArray();
  }

  private get stateExist(): boolean {
    return this.progressSteps && Array.isArray(this.progressSteps);
  }

  private initProgress(value = 0): void {
    this.itemLength = value;
    this.itemProgressList = this.generateProgressArray(this.itemLength);

  }

  private generateProgressArray(itemLength: number): {stepIndex: number; status: string} [] {
    return [...Array(itemLength).keys()].map((key) => {
      return {
        stepIndex: key,
        status: key === this.activeIndex ? Status.IN_PROGRESS : Status.PENDING,
      };
    });
  }

}
