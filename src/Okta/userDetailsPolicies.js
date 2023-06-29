import React, {useEffect} from 'react'
import Accordion from 'react-bootstrap/Accordion'

import _ from 'lodash';

const UserDetailsPolicies = ({ data, title }) => {

    useEffect(() => {

        if(!data) return

    }, [data])

    return (
        <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Body style={{padding: 0.5 + 'rem', paddingRight: 1 + 'rem'}}>

                <ul class="timeline">
                    {data && data.map(item => (
                        <li className={item.isApplicable ? `text-${item.hit}`: ''}>
                            <span className={item.isApplicable ? `text-${item.hit}`: ''}>{item.name}</span>
                            <span className={`item.isApplicable ? text-${item.hit} : ''}` + ' float-right'}>{item.status}</span>
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