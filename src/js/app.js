import Ticket from './ticket';
import Status from './status';
import Description from './description';
import Edit from './edit';
import Remove from './remove';
import Widget from './widget';

const url = 'https://coursa-heroku.herokuapp.com'; // 'http://localhost:7070';      //ВАЖНО
const mainContainer = document.querySelector('.container');
const ticketsContainer = document.querySelector('.tickets-container');
const addTicketButton = document.querySelector('.add-ticket-button');

const ticket = new Ticket();
const status = new Status();
const description = new Description();
const edit = new Edit();
const remove = new Remove();
const widget = new Widget();

// download tickets
document.addEventListener('DOMContentLoaded', () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${url}/allTickets`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const tickets = xhr.response;
        if (tickets && !tickets.length) return;
        tickets.forEach((item) => {
          const ticketHtml = ticket.getTicket(item);
          ticketsContainer.insertAdjacentHTML('beforeEnd', ticketHtml);

          const currentTicket = ticketsContainer.lastElementChild;
          const ticketStatus = currentTicket.querySelector('.ticket-status');
          const ticketStatusCheckbox = ticketStatus.querySelector('.ticket-status-checkbox');
          if (ticketStatus.dataset.status === 'true') ticketStatusCheckbox.classList.remove('hidden');
          const ticketName = currentTicket.querySelector('.ticket-name');
          const ticketEdit = currentTicket.querySelector('.ticket-edit-button');
          const ticketRemove = currentTicket.querySelector('.ticket-remove-button');

          // Смена статуса
          ticketStatus.addEventListener('click', () => {
            status.changeTicketStatus(mainContainer, currentTicket, ticketStatus, ticketStatusCheckbox, url);
          });

          // Показать описание
          ticketName.addEventListener('click', () => {
            description.showDescription(mainContainer, currentTicket, ticketName, url);
          });

          // EDIT
          ticketEdit.addEventListener('click', () => {
            //  pop-up modal window
            edit.getEditTicket(mainContainer, currentTicket, ticketEdit, url);
          });

          // REMOVE
          ticketRemove.addEventListener('click', () => {
            remove.remove(mainContainer, currentTicket, url);
          });
        });
      } catch (e) {
        console.error('error', e);
      }
    }
  });// END
  xhr.send();

  addTicketButton.addEventListener('click', () => {
    widget.getWidget(mainContainer, url);
  });
});
