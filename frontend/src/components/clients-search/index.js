import styles from './styles.module.css'

const ClientsSearch = ({ clients, onClick }) => {
  return <div className={styles.container}>
    {clients.map(({ title, id }) => {
      return <div key={id} onClick={_ => onClick({ id, title })}>{title}</div>
    })}
  </div>
}

export default ClientsSearch