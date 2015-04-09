import {Component, Template, NgElement, bootstrap, If, Compiler, View} from 'angular2/angular2';
console.log(View);
console.log(new View());


@Component({
  selector: 'foo',
  bind: {
    internalMessage: 'message'
  }
})
@Template({
  inline: `<span>Message: {{internalMessage}}</span>`
})
export class Foo {
  constructor() {
    debugger;
  }

}


@Component({
  selector: 'hello',
  services: [
    Compiler
  ]
})
@Template({
  inline: `<span><foo [message]="'Hi!'"></foo></span>`,
  directives: [If, Foo]
})
export class Hello {
  constructor(el:NgElement, compiler:Compiler) {
    console.log(el);
    console.log(compiler);
    compiler.compile(Foo).then(protoView => {
      //el.domElement.innerHTML = protoView.element.innerHTML;
      console.log(protoView);
    });
  }
}


bootstrap(Hello);
