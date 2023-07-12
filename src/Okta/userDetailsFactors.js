import React, { useMemo } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import MaterialReactTable from 'material-react-table'

import { Box } from '@mui/material'


const UserDetailsFactors = ({ data }) => {

    //Column definitions pointing to data
    const columns = useMemo(() => [
        {id: 'type', header: 'Type', accessorKey: 'factorType'},
        {id: 'enrollment', header: 'Enrollment', accessorKey: 'enrollment'},
        {
            id: 'status', 
            header: 'Status', 
            accessorKey: 'status',
            Cell: ({ cell }) => (
                <Box
                  component="span"
                  sx={(theme) => ({
                    backgroundColor: cell.getValue() === 'NOT_SETUP' ? theme.palette.warning.light : theme.palette.success.light,
                    borderRadius: '0.25rem',
                    color: '#fff',
                    p: '0.25rem',
                  })}
                >
                  {cell.getValue()}
                </Box>
              ),
        },
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
                        />
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default UserDetailsFactors