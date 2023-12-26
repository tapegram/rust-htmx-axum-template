use rscx::{component, html, props};

#[props]
pub struct PageContentProps {
    #[builder(setter(into), default = "".into())]
    title: String,

    children: String,
}

#[component]
pub fn PageContent(props: PageContentProps) -> String {
    let title = if props.title.is_empty() {
        "".into()
    } else {
        html! {
            <p><em>{props.title}</em></p>
        }
    };

    html! {
        {title}
        <div class="flex flex-col">
            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    }
}
