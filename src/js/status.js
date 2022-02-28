export default class Status {
  changeTicketStatus(mainContainer, currentTicket, ticketStatus, ticketStatusCheckbox, url) {
    if (mainContainer.querySelector('.modal')) return;
    let { status } = ticketStatus.dataset;
    const isHidden = ticketStatusCheckbox.classList.contains('hidden');
    if (isHidden) status = true;
    if (!isHidden) status = false;

    const formData = new FormData();
    formData.append('id', currentTicket.dataset.id);
    formData.append('status', status);

    const requestChangeStatusUrl = `${url}/status`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', requestChangeStatusUrl);
    document.body.style.cursor = 'wait';

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (!xhr.response.success) {
          ticketStatusCheckbox.classList.toggle('hidden');
        }
        document.body.style.cursor = '';
      }
    });
    xhr.send(formData);
  }
}
