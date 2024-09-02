import React from 'react';

import './styles.css'

const AddNewTable = (info) => {
    /**
    * Добавляет таблицу характеристик, если встречает символ ; и !
    */
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