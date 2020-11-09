import React from 'react';

const Agendaitem = ({ data }) => (
	<div className="agenda-item">
        <div className="agenda-item-content">
            <span className="tag" style={{ background: data.category.color }}>
                {data.category.tag}
            </span>
            <time>
                {data.datetime}
            </time>
            <p>{data.topic}</p>
            {data.link && (
                <a href={data.link.url} target="_blank" rel="noopener noreferrer">
                {data.link.text}
                </a>
            )}
            <span className="circle"></span>
        </div>
    </div>
);

export default Agendaitem;