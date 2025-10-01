-- Triggers
-- ========

-- Table Triggers for bpoc_employees

create trigger update_bpoc_employees_updated_at before
update
    on
    public.bpoc_employees for each row execute function update_bpoc_employees_updated_at();

-- Table Triggers for content_views

create trigger trigger_update_content_views_updated_at before
update
    on
    public.content_views for each row execute function update_content_views_updated_at();

-- Table Triggers for user_page_visits

create trigger trigger_create_user_on_page_visit before
insert
    on
    public.user_page_visits for each row execute function create_user_on_page_visit();

-- Table Triggers for users

create trigger trigger_update_users_updated_at before
update
on
public.users for each row execute function update_updated_at_column();

-- Table Triggers for pricing_quotes

create trigger trigger_update_pricing_quotes_updated_at before
update
    on
    public.pricing_quotes for each row execute function update_updated_at_column();

create trigger trigger_generate_quote_number before
insert
    on
    public.pricing_quotes for each row execute function generate_quote_number();

-- Table Triggers for pricing_quote_roles

create trigger trigger_update_pricing_quote_roles_updated_at before
update
    on
    public.pricing_quote_roles for each row execute function update_updated_at_column();
