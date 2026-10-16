import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from flask_bcrypt import Bcrypt
from flasgger import Swagger
from dotenv import load_dotenv

load_dotenv()

# ── Extensions (instanciées sans app) ────────────────────────────────────────
db       = SQLAlchemy()
migrate  = Migrate()
jwt      = JWTManager()
mail     = Mail()
bcrypt   = Bcrypt()

SWAGGER_TEMPLATE = {
    "swagger": "2.0",
    "info": {
        "title": "ColocCI API",
        "description": "API backend de la plateforme de colocation ColocCI – Côte d'Ivoire 🇨🇮",
        "version": "1.0.0",
        "contact": {"email": "contact@colocci.ci"},
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT Bearer token. Exemple: **Bearer &lt;token&gt;**",
        }
    },
    "security": [{"Bearer": []}],
}


def create_app(config_name: str = None) -> Flask:
    """Factory Flask – crée et configure l'application."""
    app = Flask(__name__, instance_relative_config=False)

    # ── Config ────────────────────────────────────────────────────────────
    from app.config import config
    cfg_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config.get(cfg_name, config['default']))

    # Créer le dossier uploads si absent
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # ── Extensions ────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    bcrypt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    Swagger(app, template=SWAGGER_TEMPLATE)

    # ── Blueprints ────────────────────────────────────────────────────────
    from app.routes.auth          import auth_bp
    from app.routes.profile       import profile_bp
    from app.routes.listings      import listings_bp
    from app.routes.matching      import matching_bp
    from app.routes.messages      import messages_bp
    from app.routes.favorites     import favorites_bp
    from app.routes.reports       import reports_bp
    from app.routes.notifications import notifications_bp
    from app.routes.admin         import admin_bp

    app.register_blueprint(auth_bp,          url_prefix='/api/auth')
    app.register_blueprint(profile_bp,       url_prefix='/api/profile')
    app.register_blueprint(listings_bp,      url_prefix='/api/listings')
    app.register_blueprint(matching_bp,      url_prefix='/api/match')
    app.register_blueprint(messages_bp,      url_prefix='/api/messages')
    app.register_blueprint(favorites_bp,     url_prefix='/api/favorites')
    app.register_blueprint(reports_bp,       url_prefix='/api/reports')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(admin_bp,         url_prefix='/api/admin')

    # ── Handlers globaux ──────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Ressource introuvable."}, 404

    @app.errorhandler(422)
    def unprocessable(e):
        return {"error": "Données invalides.", "details": str(e)}, 422

    @app.errorhandler(500)
    def server_error(e):
        return {"error": "Erreur interne du serveur."}, 500

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return {"error": "Token expiré. Veuillez vous reconnecter."}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"error": "Token invalide."}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"error": "Authentification requise."}, 401

    # ── Route santé ───────────────────────────────────────────────────────
    @app.route('/api/health')
    def health():
        return {"status": "ok", "app": "ColocCI API", "version": "1.0.0"}

    # ── Frontend SPA ──────────────────────────────────────────────────────
    import os as _os
    from flask import send_from_directory as _send

    _FRONTEND = _os.path.join(_os.path.dirname(_os.path.dirname(__file__)), 'frontend')

    @app.route('/')
    def frontend_index():
        return _send(_FRONTEND, 'index.html')

    @app.route('/<path:filename>')
    def frontend_static(filename):
        """Serve CSS, JS and other frontend assets."""
        return _send(_FRONTEND, filename)

    return app
