import React from 'react';

import './styles.css'
/**
* Добавляет таблицу характеристик, если встречает символ ; и !
*/

const AddNewTable = (info) => {
    if (info !== '') {
        let rows = info.split(';')
        return (
            <>
                {rows.length > 0 && <table className='table table-striped'>
                    <tbody>
                            {rows.map((row) => {
                                let cells = row.split('!')
                                return (
                                    <tr>
                                        {cells.map((cell) => {
                                            return (
                                                <td className='table-min'>
                                                    {cell}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        
                    </tbody>
                </table>}
            </>
        );
    }
};

export default AddNewTable;