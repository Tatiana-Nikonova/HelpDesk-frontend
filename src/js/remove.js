export default class Remove {
  removeTicketCancelButtonHandler(mainContainer) {
    if (!mainContainer) return;

    const widgetRemoveTicket = mainContainer.querySelector('[data-widget=removeTicket]');
    const removeTicketCancelButton = widgetRemoveTicket.querySelector('[data-id=cancel]');

    removeTicketCancelButton.addEventListener('click', () => {
      widgetRemoveTicket.remove();
    });
  }

  removeTicketOkButtonHandler(mainContainer, currentTicket, url) {
    if (!mainContainer) return;

    const widgetRemoveTicket = mainContainer.querySelector('[data-widget=removeTicket]');
    const removeTicketOkButton = widgetRemoveTicket.querySelector('[data-id=ok]');

    removeTicketOkButton.addEventListener('click', () => {
      const formData = new FormData();
      formData.append('id', currentTicket.dataset.id);

      const request = `${url}/id`;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', request);
      xhr.responseType = 'json';
      document.body.style.cursor = 'wait';
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            setTimeout(() => {
              document.location.reload();
            }, 300);
            document.body.style.cursor = '';
          } catch (e) {
            console.error('error', e);
          }
        }
      });
      widgetRemoveTicket.remove();
      xhr.send(formData);
    });
  }

  remove(mainContainer, currentTicket, url) {
    if (mainContainer.querySelector('.modal')) return;
    //  pop-up modal window
    const widgetRemoveTicketHtml = `
    <div data-widget="removeTicket" class="modal widget-remove">
      <h2>Удалить тикет?</h2>  
      <div class="widget-form">
        <p class="widget-remove-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
        <div class="widget-form-controls">
          <button data-id="cancel" class="widget-button">Отмена</button>  
          <button data-id="ok" class="widget-button">Ок</button> 
        </div> 
      </div>
    </div>
    `;
    mainContainer.insertAdjacentHTML('beforeEnd', widgetRemoveTicketHtml);

    this.removeTicketCancelButtonHandler(mainContainer);
    this.removeTicketOkButtonHandler(mainContainer, currentTicket, url);
  }
}
