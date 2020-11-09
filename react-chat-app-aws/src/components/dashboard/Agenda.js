import React from 'react';
import agendaData from '../../Datagenda';
import Agendaitem from './Agendaitem';
import '../styles/agenda.css'

const Agenda = () => agendaData.length > 0 && (
	<div className="agenda-container">
		{agendaData.map((data, idx) =>(
			<Agendaitem data={data} key={idx} />
		))}
	</div>
);

export default Agenda;



