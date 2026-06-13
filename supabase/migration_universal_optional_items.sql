-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION — Universal optional item rules (all funeral homes)
-- Safe to re-run: UPDATE only, no INSERTs
-- ─────────────────────────────────────────────────────────────────────────────

-- Limousine → optional in all packages (alacarte and named)
update package_items pi set is_optional = true
from service_items si
where pi.service_item_id = si.id
  and si.name ilike '%limousine%';

-- Reception → optional in all packages
update package_items pi set is_optional = true
from service_items si
where pi.service_item_id = si.id
  and si.name ilike '%reception%';

-- Catered / catering → optional in all packages
update package_items pi set is_optional = true
from service_items si
where pi.service_item_id = si.id
  and si.name ilike '%cater%';

-- Flower Vehicle → optional for alacarte packages only
update package_items pi set is_optional = true
from service_items si, packages p
where pi.service_item_id = si.id
  and pi.package_id = p.id
  and si.name ilike '%flower vehicle%'
  and p.pkg_type = 'alacarte';

-- Flower Vehicle → mandatory in named packages (pkg_type = 'package')
update package_items pi set is_optional = false
from service_items si, packages p
where pi.service_item_id = si.id
  and pi.package_id = p.id
  and si.name ilike '%flower vehicle%'
  and p.pkg_type = 'package';

-- Family Support Options (category c1000000-0000-0000-0000-000000000004)
-- → optional in all packages; rendered as a radio-select group in the UI
update package_items pi set is_optional = true
from service_items si
where pi.service_item_id = si.id
  and si.category_id = 'c1000000-0000-0000-0000-000000000004';
