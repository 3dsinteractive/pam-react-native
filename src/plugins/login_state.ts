import PamTracker from '../PamTracker';
import { type Plugin } from '../core/plugin';

export class LoginState implements Plugin {
  initPlugin(pam: PamTracker): void {
    pam.hook.onPreTracking('*', (p) => {
      const contactId = pam.contactState?.getContactId();
      const database = pam.contactState?.getDatabase();

      if (!database) {
        // When database is empty cancel the event tracking
        p.cancel = true;
        return p;
      }

      if (p.form_fields._contact_id === '<REMOVE>') {
        delete p.form_fields._contact_id;
      } else if (contactId) {
        p.form_fields._contact_id = contactId;
      }
      if (!p.form_fields._database) {
        p.form_fields._database = database;
      }

      return p;
    });

    pam.hook.onPostTracking('*', (payload, result) => {
      if (payload.event === 'logout') {
        pam.contactState?.logout();
      } else if (payload.event === 'login') {
        if (result && pam.config.loginDBAlias === result._database) {
          const loginKey = pam.contactState?.getLoginKey();
          if (loginKey) {
            const loginId = payload.form_fields[loginKey];
            pam.contactState?.login(loginId);
          }
        }
      }
      if (result && result.contact_id) {
        pam.contactState?.setContactId(result.contact_id);
      }
    });

    pam.hook.onClean(async (_) => {
      pam.contactState?.clean();
    });
  }
}
