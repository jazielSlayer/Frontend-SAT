function modulos () {
    return (
        <div className="proyectos-container">
            <header className="proyectos-header">
                    <h2 style={styles.title}>Modulos</h2>
                    <div className="header-actions" style={{ padding: 15 }}>
                      <button className="btn-create" onClick={openCreate}>+ Nuevo Rol</button>
                    </div>
            </header>
        </div>
    )
}
export default modulos;