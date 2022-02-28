export default class Widget {
  addTicketCancelButtonHandler(mainContainer) {
    if (!mainContainer) return;
    const widgetAddTicket = mainContainer.querySelector('[data-widget=addTicket]');
    const addTicketForm = widgetAddTicket.querySelector('[data-id=addTicket-form]');
    const addTicketCancelButton = widgetAddTicket.querySelector('[data-id=cancel]');
    addTicketCancelButton.addEventListener('click', () => {
      addTicketForm.reset();
      widgetAddTicket.remove();
    });
  }

  addTicketSubmitHandler(mainContainer, url) {
    if (!mainContainer) return;
    const widgetAddTicket = mainContainer.querySelector('[data-widget=addTicket]');
    const addTicketForm = widgetAddTicket.querySelector('[data-id=addTicket-form]');

    addTicketForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const inputName = addTicketForm.name.value.trim();
      const inputDescription = addTicketForm.description.value.trim();
      if (inputName === '') return;

      const formData = new FormData();
      formData.append('name', inputName);
      formData.append('description', inputDescription);
      formData.append('status', false);
      formData.append('created', new Date().toLocaleString());
      const request = `${url}/`;
      const xhrAddTicket = new XMLHttpRequest();
      xhrAddTicket.open('POST', request);
      document.body.style.cursor = 'wait';
      widgetAddTicket.style.cursor = 'wait';
      xhrAddTicket.addEventListener('load', () => {
        if (xhrAddTicket.status >= 200 && xhrAddTicket.status < 300) {
          try {
            setTimeout(() => {
              document.body.style.cursor = '';
              widgetAddTicket.style.cursor = '';
              document.location.reload();
            }, 300);
          } catch (e) {
            console.error('error', e);
          }
        }
      });
      xhrAddTicket.send(formData);
      addTicketForm.reset();
      widgetAddTicket.remove();
    });
  }

  getWidget(mainContainer, url) {
    // if active modal already exist - return
    if (mainContainer.querySelector('.modal')) return;
    //  pop-up modal window
    const widgetAddTicketHtml = `
    <div data-widget="addTicket" class="modal widget-add">
    <h2>Добавить тикет</h2>  
    <form data-id="addTicket-form" class="widget-form">
      <label>
        Краткое описание
          <textarea rows=2 data-id="name" name="name" required class="widget-input"></textarea>
      </label>
      <label>
        Подробное описание
          <textarea rows=5 data-id="description" name="description" class="widget-input"></textarea>
      </label>
      <div class="widget-form-controls">
        <button data-id="cancel" class="widget-button">Отмена</button>  
        <button type="submit" data-id="ok" class="widget-button">Ок</button> 
      </div>     
    </form>
    </div>
    `;

    mainContainer.insertAdjacentHTML('beforeEnd', widgetAddTicketHtml);

    this.addTicketCancelButtonHandler(mainContainer);
    this.addTicketSubmitHandler(mainContainer, url);
  }
}
