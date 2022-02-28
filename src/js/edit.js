export default class Edit {
  editTicketCancelButtonHandler(mainContainer) {
    if (!mainContainer) return;
    const widgetEditTicket = mainContainer.querySelector('[data-widget=editTicket]');
    const editTicketForm = widgetEditTicket.querySelector('[data-id=editTicket-form]');
    const editTicketCancelButton = widgetEditTicket.querySelector('[data-id=cancel]');

    editTicketCancelButton.addEventListener('click', () => {
      editTicketForm.reset();
      widgetEditTicket.remove();
    });
  }

  editTicketSubmitHandler(mainContainer, ticketEdit, url) {
    if (!mainContainer) return;

    const widgetEditTicket = mainContainer.querySelector('[data-widget=editTicket]');
    const editTicketForm = widgetEditTicket.querySelector('[data-id=editTicket-form]');
    const editTicketNameInput = widgetEditTicket.querySelector('[data-id=name]');
    const editingTicketID = ticketEdit.closest('.ticket-wrapper').dataset.id;
    const editingTicketName = ticketEdit.closest('.ticket-wrapper').querySelector('.ticket-name').textContent;
    const editingTicketStatus = ticketEdit.closest('.ticket-wrapper').querySelector('.ticket-status').dataset.status;
    editTicketNameInput.value = editingTicketName;

    editTicketForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const inputName = editTicketForm.name.value.trim();
      const inputDescription = editTicketForm.description.value.trim();
      if (inputName === '') return;

      const formData = new FormData();
      formData.append('id', editingTicketID);
      formData.append('name', inputName);
      formData.append('description', inputDescription);
      formData.append('status', editingTicketStatus);
      formData.append('created', new Date().toLocaleString());

      const request = `${url}/`;
      const xhrEditTicket = new XMLHttpRequest();
      xhrEditTicket.open('POST', request);
      document.body.style.cursor = 'wait';
      widgetEditTicket.style.cursor = 'wait';

      xhrEditTicket.addEventListener('load', () => {
        if (xhrEditTicket.status >= 200 && xhrEditTicket.status < 300) {
          try {
            document.body.style.cursor = '';
            widgetEditTicket.style.cursor = '';
            setTimeout(() => {
              document.location.reload();
            }, 300);
          } catch (e) {
            console.error('error', e);
          }
        }
      });

      editTicketForm.reset();
      widgetEditTicket.remove();

      xhrEditTicket.send(formData);
    });// SUBMIT endline
  }

  createRequestTicketDescription(mainContainer, currentTicket, url) {
    if (!mainContainer) return;
    const widgetEditTicket = mainContainer.querySelector('[data-widget=editTicket]');
    const editTicketDescriptionInput = widgetEditTicket.querySelector('[data-id=description]');
    const request = `${url}/${currentTicket.dataset.id}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', request);

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const responsedDescription = xhr.response;
          editTicketDescriptionInput.value = responsedDescription;
        } catch (e) {
          console.error(e);
        }
      }
    });
    xhr.send();
  }

  getEditTicket(mainContainer, currentTicket, ticketEdit, url) {
    // active modal already exist
    if (mainContainer.querySelector('.modal')) return;
    //  pop-up modal window
    const widgetEditTicketHtml = `
    <div data-widget="editTicket" class="modal widget-edit">
    <h2>Редактировать тикет</h2>  
    <form data-id="editTicket-form" class="widget-form">
      <label>
        Краткое описание
          <textarea rows=1 data-id="name" name="name" required class="widget-input"></textarea>
      </label>
      <label>
        Подробное описание
          <textarea rows=3 data-id="description" name="description" class="widget-input"></textarea>
      </label>
      <div class="widget-form-controls">
        <button data-id="cancel" class="widget-button">Отмена</button>  
        <button type="submit" data-id="ok" class="widget-button">Ок</button> 
      </div>     
    </form>
    </div>
    `;

    mainContainer.insertAdjacentHTML('beforeEnd', widgetEditTicketHtml);

    this.createRequestTicketDescription(mainContainer, currentTicket, url);
    this.editTicketCancelButtonHandler(mainContainer);
    this.editTicketSubmitHandler(mainContainer, ticketEdit, url);
  }
}
