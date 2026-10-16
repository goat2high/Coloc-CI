"""Point d'entree de l'application ColocCI Backend."""
import pymysql
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Creer la base de donnees si elle n'existe pas encore
        try:
            cfg  = app.config
            host = cfg.get('DB_HOST', 'localhost')
            port = int(cfg.get('DB_PORT', 3306))
            user = cfg.get('DB_USER', 'root')
            pw   = cfg.get('DB_PASSWORD', '')
            name = cfg.get('DB_NAME', 'colocci_db')
            conn = pymysql.connect(host=host, port=port, user=user, password=pw)
            conn.cursor().execute(
                "CREATE DATABASE IF NOT EXISTS `%s` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" % name
            )
            conn.close()
            print("[OK] Base de donnees '%s' prete." % name)
        except Exception as e:
            print("[WARN] Impossible de creer la base de donnees : %s" % e)
            print("       Assurez-vous que XAMPP / MySQL est lance.")

        # Importer tous les modeles pour que SQLAlchemy les enregistre
        from app.models import User, Profile, Listing, Photo, Message, Favorite, Report, Notification  # noqa
        try:
            db.create_all()
            print("[OK] Tables creees / verifiees.")
        except Exception as e:
            print("[WARN] db.create_all() a echoue : %s" % e)
            print("       Le serveur Flask demarre quand meme (mode sans DB).")

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config.get('DEBUG', True),
    )
