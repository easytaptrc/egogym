# EGO GYM · CLUB — Sistema de reservas

App de reservas para **Spinning** y **Box**, con mapa de bicicletas tipo cine, panel de administración **en archivo aparte**, alta de personal y reporte de flujo (ganancia/pérdida).

## Archivos del proyecto

| Archivo | Qué es |
|---|---|
| **`index.html`** | La página **pública** (clientes). Aquí **no** hay ningún acceso al admin. |
| **`admin.html`** | El **panel de administración** (con login). Esta liga se la pasas **solo al dueño**. |
| `styles.css` | Estilos (compartido por las dos páginas). |
| `ego-core.js` | Configuración de Firebase, horarios, precios y toda la lógica de datos (compartido). |
| `logo.png` | **Tu logo** (lo pones tú, ver abajo). |
| `firestore.rules` | Reglas de seguridad para Firebase. |

> **Súbelos todos juntos en la misma carpeta.** Si mueves uno, muévelos todos.

---

## 1) Pon tu logo

Guarda tu logo con el nombre exacto **`logo.png`** en la misma carpeta que `index.html`. Aparecerá solo en la página, en el panel y en el login.

- Recomendado: fondo **transparente** y forma más o menos cuadrada.
- Mientras no exista `logo.png`, se muestra un logo temporal (para que nada se vea roto).

---

## 2) Pruébalo YA (sin instalar nada)

Abre cualquiera de los dos archivos agregando `?demo=1` al final:
- `index.html?demo=1` → lo que ven los clientes.
- `admin.html?demo=1` → el panel. Entra con **usuario `edson` / contraseña `egogym2026@`**.

En modo demo los datos son de ejemplo y se guardan solo en tu navegador (no tocan tu Firebase).

> También tienes el **demo en línea** (te pasé el enlace en el chat), que es una versión "todo en uno" para que pruebes el panel sin instalar nada.

---

## 3) Ponlo en producción con TU Firebase

Tu configuración ya viene puesta en `ego-core.js`. Solo activa 3 cosas en la consola de Firebase (proyecto **egogym-39e45**):

**a) Inicio de sesión:** Authentication → Sign-in method → activa **Correo/Contraseña**.

**b) Base de datos:** Firestore Database → **Crear base de datos** (elige una ubicación).

**c) Reglas:** Firestore Database → Reglas → pega **todo** el contenido de `firestore.rules` → **Publicar**.

**d) Primer ingreso:** abre `admin.html` y entra con **edson / egogym2026@**. La primera vez se crea tu cuenta de administrador sola. Después das de alta a tu personal desde la pestaña **Personal**.

---

## 4) Súbelo a internet

**Firebase Hosting** (recomendado, gratis):
```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # proyecto egogym-39e45; carpeta pública: la que tiene index.html
firebase deploy
```
Quedará así:
- Clientes: `https://egogym-39e45.web.app`
- Dueño (privado): `https://egogym-39e45.web.app/admin.html`

También funciona en Netlify, Vercel, Hostinger o cualquier hosting: sube los 6 archivos juntos.

> El **admin está separado** para que la gente no lo vea desde el index. Aun así, cualquiera que tenga la liga de `admin.html` verá la pantalla de login, pero **necesita usuario y contraseña** para entrar (la seguridad real la dan el login + las reglas de Firebase). Comparte esa liga solo con quien deba entrar.

---

## 5) Qué puede hacer el ADMIN (en admin.html)

- **Reservas:** ver las de hoy o de cualquier fecha, filtrar por actividad, marcar **asistió / no asistió**, **cobrar**, **cancelar** (libera el lugar) y crear reservas manuales (walk-ins).
- **Miembros:** registrar miembros (nombre + teléfono + plan o fecha). Al guardar se **genera un ID de 6 caracteres** (ej. `K7M2Q9`) que puedes **copiar o enviar por WhatsApp**. Renovar (planes que suman días), activar/desactivar y eliminar. El semáforo muestra el estado: verde (activa), amarillo (por vencer) y rojo (vencida).
- **Horarios:** cambiar precios, número de bicicletas y cupos; agregar o quitar horarios de cada día; y **cerrar o limitar un día específico** ("hoy solo recibo 10").
- **Personal:** dar de alta usuarios. Rol **Personal** solo ve reservas; **Administrador** puede todo.
- **Reportes:** ingresos, gastos y **ganancia/pérdida** con gráficas por día y por actividad. Registras gastos (renta, luz, sueldos…).
- **Ajustes:** nombre, teléfono, WhatsApp, dirección y ligas de redes (aparecen en el index).

## 6) Qué ve el CLIENTE / MIEMBRO (en index.html)

Logo, redes, teléfono y el botón **RESERVAR**. **Reservar es solo para miembros:** al tocar RESERVAR se pide el **ID + teléfono**. Una vez dentro, arriba a la derecha aparece un **semáforo**:

- 🟢 **Verde:** membresía activa, reserva normal.
- 🟡 **Amarillo:** faltan 4 días o menos para vencer (aún puede reservar, con aviso para renovar).
- 🔴 **Rojo:** membresía vencida → **no puede reservar**; le sale el mensaje *"Tu membresía ha vencido, comunícate con el gimnasio"* y se abre **WhatsApp automáticamente** con un mensaje listo para renovar.

Ya dentro: elige **Spinning** o **Box** → día y horario con cupos en vivo → en Spinning **elige su bicicleta en el mapa** → confirma (ya no escribe sus datos, se toman de su membresía) → botón para **confirmar por WhatsApp**. Si un horario está lleno, mensaje amable de **"¡Cupo lleno!"**. La sesión del miembro se recuerda en su teléfono, así no escribe su ID cada vez.

### Cómo entra un miembro
1. El admin lo registra en la pestaña **Miembros** y le da su **ID**.
2. El miembro abre la página, toca **RESERVAR** (o "Soy miembro" arriba a la derecha) y escribe su **ID + teléfono** (el mismo con el que lo registraron).

---

## 7) Horarios y precios por defecto (editables desde el panel)

- **Spinning:** Lun–Jue 7:00, 8:00 AM y 7:00, 8:00 PM · Viernes 7:00 y 8:00 AM · **12 bicicletas** (mapa 3×4)
- **Box:** Lun–Vie 5:00, 6:00, 7:00 y 8:00 PM
- **Precios:** Spinning $80 · Box $60 *(ejemplo — cámbialos en Horarios)*

## 8) Notas

- **⚠️ Vuelve a publicar las reglas:** esta versión agrega la colección de **miembros**, así que copia otra vez `firestore.rules` en Firebase → Firestore → Reglas → Publicar. Si no, el acceso de miembros marcará "permisos insuficientes".
- **Contraseña del admin:** por ahora se cambia en Firebase Console → Authentication (usuario `edson@egogym.app`). Si quieres un botón dentro del panel, dímelo y lo agrego.
- **Versión de Firebase:** `10.14.1` (líneas `<script src="...firebasejs/10.14.1/...">` en `index.html` y `admin.html`).
- **Seguridad:** las reglas incluidas son adecuadas para un gimnasio pequeño. Para blindaje extra (Cloud Functions), te ayudo cuando quieras.
