import React, { useMemo } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import MaterialReactTable from 'material-react-table'

const UserDetailsFactors = ({ data }) => {

    //Column definitions pointing to data
    const columns = useMemo(() => [
        {id: 'type', header: 'Type', accessorKey: 'factorType'},
        {id: 'enrollment', header: 'Enrollment', accessorKey: 'enrollment'},
        {id: 'status', header: 'Status', accessorKey: 'status'},
    ],
    [],
    )

    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Authenticators</Accordion.Header>
                <Accordion.Body>

                {data &&
                        <MaterialReactTable
                            columns={columns}
                            data={data.catalog}
                            enableRowSelection={false} //turn off a feature
                            enableColumnOrdering={true}
                            enableGlobalFilter={false} 
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}

                            initialState={{ density: 'compact', }}

                            muiTableBodyRowProps={({ row }) => ({
                                backgroundcolor: row.original.status === 'ACTIVE' ? 'success' : 'secondary',
                              })}
                        />
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default UserDetailsFactors