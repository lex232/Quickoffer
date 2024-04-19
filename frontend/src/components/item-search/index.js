import styles from './styles.module.css'

const ItemSearch = ({ items, onClick }) => {
  console.log("IN ITEM SEACH", items)
  return <div className={styles.container}>
    {items.map(({ title, id }) => {
      return <div key={id} onClick={_ => onClick({ id, title })}>{title}</div>
    })}
  </div>
}

export default ItemSearch