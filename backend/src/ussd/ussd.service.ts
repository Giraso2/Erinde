import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

interface UssdSession {
  sessionId: string;
  phone: string;
  state: string;
  data: Record<string, any>;
  createdAt: Date;
}

@Injectable()
export class UssdService {
  private sessions: Map<string, UssdSession> = new Map();
  private transactions: any[] = [];

  private menu = {
    main: {
      text: 'Welcome to Erinde - National Health Service\n1. Book Appointment\n2. Make Payment\n3. Queue Number\n4. Find Hospital\n0. Exit',
      options: { '1': 'book_name', '2': 'payment_amount', '3': 'queue_hospital', '4': 'find_hospital', '0': 'exit' },
    },
    book_name: { text: 'Enter patient full name:', next: 'book_hospital' },
    book_hospital: {
      text: 'Select hospital:\n1. CHUK\n2. Kanombe Hospital\n3. Kigali Teaching Hospital\n4. Rwamagana Hospital\n5. Butare Hospital',
      options: { '1': 'book_doctor', '2': 'book_doctor', '3': 'book_doctor', '4': 'book_doctor', '5': 'book_doctor' },
    },
    book_doctor: {
      text: 'Select doctor:\n1. Dr Giraso - General\n2. Dr Alice - Pediatrics\n3. Dr John - Surgery\n4. Dr Marie - Maternity',
      options: { '1': 'book_confirm', '2': 'book_confirm', '3': 'book_confirm', '4': 'book_confirm' },
    },
    book_confirm: {
      text: 'Confirm booking?\n1. Confirm\n2. Cancel',
      options: { '1': 'book_done', '2': 'main' },
    },
    book_done: {
      text: '✅ Appointment booked!\nRef: {ref}\nQueue: Q-{queue}\nHospital: {hospital}\nEstimated wait: {wait} min\n\nThank you for using Erinde.',
      end: true,
    },
    payment_amount: { text: 'Enter amount to pay (RWF):', next: 'payment_method' },
    payment_method: {
      text: 'Payment method:\n1. MTN Mobile Money\n2. Airtel Money\n3. CBHI Insurance',
      options: { '1': 'payment_pin', '2': 'payment_pin', '3': 'payment_done' },
    },
    payment_pin: { text: 'Enter Mobile Money PIN:', next: 'payment_done' },
    payment_done: {
      text: '✅ Payment of RWF {amount} successful!\nRef: {ref}\nThank you for using Erinde.',
      end: true,
    },
    queue_hospital: {
      text: 'Select hospital:\n1. CHUK\n2. Kanombe\n3. Kigali\n4. Rwamagana\n5. Butare',
      options: { '1': 'queue_number', '2': 'queue_number', '3': 'queue_number', '4': 'queue_number', '5': 'queue_number' },
    },
    queue_number: {
      text: '📋 Your queue number: Q-{queue}\nPatients ahead: {ahead}\nEstimated wait: {wait} min\nHospital: {hospital}',
      end: true,
    },
    find_hospital: {
      text: 'Find hospitals by:\n1. Nearest to me\n2. Least busy\n3. Specific district\n0. Back',
      options: { '1': 'find_result', '2': 'find_result', '3': 'find_district', '0': 'main' },
    },
    find_district: {
      text: 'Select district:\n1. Kigali City\n2. Eastern\n3. Southern\n4. Northern\n5. Western',
      options: { '1': 'find_result', '2': 'find_result', '3': 'find_result', '4': 'find_result', '5': 'find_result' },
    },
    find_result: {
      text: '🏥 Nearby Hospitals:\n1. CHUK - 2km - 92%\n2. Kanombe - 5km - 78%\n3. Kigali Hosp - 3km - 65%\n\nReply with number to book, or 0 back',
      options: { '1': 'book_hospital', '2': 'book_hospital', '3': 'book_hospital', '0': 'find_hospital' },
    },
    exit: { text: 'Thank you for using Erinde. Stay healthy!', end: true },
  };

  handleUssd(sessionId: string, phone: string, text: string): { response: string; type: 'CON' | 'END' } {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, { sessionId, phone, state: 'main', data: {}, createdAt: new Date() });
    }

    const sess = this.sessions.get(sessionId)!;
    const parts = text ? text.split('*') : [];
    const userInput = parts.length > 0 ? parts[parts.length - 1] : '';
    const currentMenu = this.menu[sess.state];

    if (!text) {
      sess.state = 'main';
      sess.data = {};
      this.logTransaction(phone, 'menu_main');
      return { response: this.menu.main.text, type: 'CON' };
    }

    if (!currentMenu) {
      sess.state = 'main';
      return { response: this.menu.main.text, type: 'CON' };
    }

    if (currentMenu.end) {
      this.sessions.delete(sessionId);
      const resp = this.fillTemplate(currentMenu.text, sess.data);
      return { response: resp, type: 'END' };
    }

    if (userInput === '0') {
      sess.state = 'main';
      return { response: this.menu.main.text, type: 'CON' };
    }

    const nextState = currentMenu.options?.[userInput] || currentMenu.next;
    if (!nextState) {
      return { response: `Invalid option.\n${currentMenu.text}`, type: 'CON' };
    }

    this.processInput(sess, userInput);
    sess.state = nextState;

    const nextMenu = this.menu[nextState];
    if (nextMenu) {
      const resp = this.fillTemplate(nextMenu.text, sess.data);
      if (nextMenu.end) {
        this.sessions.delete(sessionId);
        return { response: resp, type: 'END' };
      }
      return { response: resp, type: 'CON' };
    }

    return { response: this.menu.main.text, type: 'CON' };
  }

  private processInput(sess: UssdSession, input: string) {
    const hospitals = { '1': 'CHUK', '2': 'Kanombe Hospital', '3': 'Kigali Teaching Hospital', '4': 'Rwamagana Hospital', '5': 'Butare Hospital' };
    const doctors = { '1': 'Dr Giraso', '2': 'Dr Alice', '3': 'Dr John', '4': 'Dr Marie' };

    switch (sess.state) {
      case 'book_name':
        sess.data['name'] = input;
        break;
      case 'book_hospital':
        sess.data['hospital'] = hospitals[input] || 'CHUK';
        break;
      case 'book_doctor':
        sess.data['doctor'] = doctors[input] || 'Dr Giraso';
        break;
      case 'book_confirm':
        if (input === '1') {
          const ref = `ERN-${Math.floor(10000 + Math.random() * 90000)}`;
          const queue = Math.floor(100 + Math.random() * 900);
          const wait = Math.floor(10 + Math.random() * 80);
          Object.assign(sess.data, { ref, queue, wait });
          this.logTransaction(sess.phone, 'book_appointment', sess.data.hospital, ref);
        }
        break;
      case 'payment_amount':
        sess.data['amount'] = input;
        break;
      case 'payment_pin':
        const payRef = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;
        sess.data['ref'] = payRef;
        sess.data['pin'] = '****';
        this.logTransaction(sess.phone, 'payment', sess.data.amount, payRef);
        break;
      case 'queue_hospital':
        sess.data['hospital'] = hospitals[input] || 'CHUK';
        sess.data['queue'] = Math.floor(100 + Math.random() * 900);
        sess.data['ahead'] = Math.floor(5 + Math.random() * 45);
        sess.data['wait'] = Math.floor(10 + Math.random() * 110);
        break;
    }
  }

  private fillTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => data[key]?.toString() || key);
  }

  private logTransaction(phone: string, action: string, detail?: string, ref?: string) {
    this.transactions.push({ phone, action, detail, ref, time: new Date().toISOString() });
  }

  getStats() {
    return {
      activeSessions: this.sessions.size,
      totalTransactions: this.transactions.length,
      totalBookings: this.transactions.filter((t) => t.action === 'book_appointment').length,
      totalPayments: this.transactions.filter((t) => t.action === 'payment').length,
      ussdCode: '*880#',
      status: 'active',
    };
  }

  getTransactions() {
    return this.transactions.slice(-50);
  }
}
