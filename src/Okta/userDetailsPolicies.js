import React from 'react'
import Accordion from 'react-bootstrap/Accordion'

const UserDetailsPolicies = ({ data, title, openByDefault }) => {

    const defaultActiveKey = openByDefault ? "0" : null

    return (
        <Accordion defaultActiveKey={defaultActiveKey} alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Body style={{padding: 0.5 + 'rem', paddingRight: 1 + 'rem'}}>

                <ul className="timeline">
                    {data && data.map(item => (
                        <li key={item.id} className={item.isApplicable ? `text-${item.hit}`: ''}>
                            <span className={item.isApplicable ? `text-${item.hit}`: ''}>{item.name}</span>
                            <span className={`${item.isApplicable ? `text-${item.hit}` : ''} float-right`}>{item.status}</span>
                            <p className="text-secondary">{item.description}</p>
                        </li>))
                    }
				</ul>

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default UserDetailsPolicies