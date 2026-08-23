// Storage abstraction.
//
// Today this reads/writes localStorage, so the app works with zero backend.
// If you add a Python API later (see README), swap the bodies of these
// four functions for `fetch()` calls — nothing in the components needs to
// change, they only ever call get/set/list/remove.

const PREFIX = 'tracker:'

export async function set(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export async function get(key) {
  const raw = localStorage.getItem(PREFIX + key)
  return raw ? JSON.parse(raw) : null
}

export async function remove(key) {
  localStorage.removeItem(PREFIX + key)
}

// Returns all keys (without PREFIX) that start with `prefix`.
export async function list(prefix) {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(PREFIX + prefix)) {
      keys.push(k.slice(PREFIX.length))
    }
  }
  return keys
}
