describe('Todo 앱', () => {
  beforeEach(() => {
    cy.visit('/');
    // 기존 할 일 목록을 초기화하기 위해 API 호출
    cy.request('GET', 'https://cwxhc8o84b.execute-api.ap-northeast-2.amazonaws.com/prod/todos')
      .then((response) => {
        response.body.forEach((todo: any) => {
          cy.request('DELETE', `https://cwxhc8o84b.execute-api.ap-northeast-2.amazonaws.com/prod/todos/${todo.id}`);
        });
      });
  });

  it('새로운 할 일을 추가할 수 있습니다', () => {
    const title = '새로운 할 일';
    const description = '할 일 설명';

    // 할 일 입력
    cy.get('[data-testid=todo-title-input]').type(title);
    cy.get('[data-testid=todo-description-input]').type(description);
    cy.get('[data-testid=add-todo-button]').click();

    // 할 일이 목록에 표시되는지 확인
    cy.contains(title).should('be.visible');
    cy.contains(description).should('be.visible');
  });

  it('할 일을 완료로 표시할 수 있습니다', () => {
    const title = '완료할 할 일';
    
    // 할 일 추가
    cy.get('[data-testid=todo-title-input]').type(title);
    cy.get('[data-testid=add-todo-button]').click();

    // 완료 체크박스 클릭
    cy.get('[data-testid=todo-checkbox]').first().click();

    // 완료 상태 확인
    cy.get('[data-testid=todo-item]').first().should('have.class', 'completed');
  });

  it('할 일을 삭제할 수 있습니다', () => {
    const title = '삭제할 할 일';
    
    // 할 일 추가
    cy.get('[data-testid=todo-title-input]').type(title);
    cy.get('[data-testid=add-todo-button]').click();

    // 삭제 버튼 클릭
    cy.get('[data-testid=delete-todo-button]').first().click();

    // 할 일이 목록에서 사라졌는지 확인
    cy.contains(title).should('not.exist');
  });

  it('할 일 목록이 비어있을 때 메시지를 표시합니다', () => {
    cy.contains('할 일이 없습니다').should('be.visible');
  });

  it('잘못된 입력을 처리합니다', () => {
    // 빈 제목으로 할 일 추가 시도
    cy.get('[data-testid=add-todo-button]').click();
    cy.contains('제목을 입력해주세요').should('be.visible');
  });
});
