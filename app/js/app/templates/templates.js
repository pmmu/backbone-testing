/*jslint maxlen: 200 */
// Underscore Templates

//each userstory line item on the main userstories view
App.Templates["template-userstories-item"] =
    "<td class=\"userstory-name\">" +
        "  <div class=\"userstory-title userstory-view\"><%= title %></div>" +
        "</td>" +
        "<td class=\"userstory-action\">" +
        "  <div class=\"btn-group pull-right\">" +
        "    <button class=\"btn userstory-edit\">" +
        "      <i class=\"icon-pencil\"></i>" +
        "    </button>" +
        "    <button class=\"btn userstory-delete\">" +
        "      <i class=\"icon-trash\"></i>" +
        "    </button>" +
        "  </div>" +
        "</td>";

//view for edit of single user story on page
App.Templates["template-userstory"] =
    "<div id=\"userstory-pane-view\" class=\"pane\">" +
        "  <div id=\"userstory-pane-view-content\"></div>" +
        "</div>" +
        "<div id=\"userstory-pane-edit\" class=\"pane\">" +
        "  <form id=\"userstory-form-edit\">" +
        "    <div class=\"label\">Title</div>" +
        "    <input id=\"input-title\" class=\"input-block-level\"" +
        "           type=\"text\" placeholder=\"title\"" +
        "           value=\"<%= title %>\">" +
        "    <div class=\"label\">Statement</div>" +
        "    <input id=\"input-statement\" class=\"input-block-level\"" +
        "           type=\"text\" placeholder=\"statement\"" +
        "           value=\"<%= statement %>\">" +
        "    <div class=\"label\">Story Points</div>" +
        "    <input id=\"input-storypoints\" class=\"input-block-level\"" +
        "           type=\"text\" placeholder=\"storypoints\"" +
        "           value=\"<%= storyPoints %>\">" +
        "    <div class=\"label\">Acceptance Criteria</div>" +
        "    <table id=\"acceptancecriteria-list\" class=\"table table-bordered table-hover\">" +
        "       <tbody>" +
        "         <tr class=\"acceptancecriteria-new\">" +
        "           <td class=\"acceptancecriteria-name\">" +
        "               <input id=\"acceptancecriteria-new-input\" placeholder=\"Write a new acceptance criteria.\" autofocus />" +
        "           </td>" +
        "           <td class=\"acceptancecriteria-action\">" +
        "             <div id=\"acceptancecriteria-create\" class=\"btn pull-right\">" +
        "               <i class=\"icon-plus\"></i>" +
        "             </div>" +
        "           </td>" +
        "         </tr>" +
        "       </tbody>" +
        "   </table>" +
        "  </form>" +
        "</div>";

//each acceptance criteria line item edit view on the user story edit page view
App.Templates["template-acceptancecriteria-item"] =
    "<td class=\"acceptancecriteria-name\">" +
        "  <div class=\"acceptancecriteria-title acceptancecriteria-view\"><%= acceptanceCriteria %></div>" +
        "</td>" +
        "<td class=\"acceptancecriteria-action\">" +
        "  <div class=\"btn-group pull-right\">" +
        "    <button class=\"btn acceptancecriteria-edit\">" +
        "      <i class=\"icon-pencil\"></i>" +
        "    </button>" +
        "    <button class=\"btn acceptancecriteria-delete\">" +
        "      <i class=\"icon-trash\"></i>" +
        "    </button>" +
        "  </div>" +
        "</td>";

//view single user story on a page
App.Templates["template-userstory-view"] =
    "<div class=\"well well-small\">" +
        "  <h4 id=\"pane-title\"><%= title %></h4>" +
        "</div>" +
        "<div class=\"label\">Statement</div>" +
        "<div id=\"pane-statement\"><%= statement %></div>" +
        "<div class=\"label\">Story Points</div>" +
        "<div id=\"pane-storypoints\"><%= storyPoints %></div>" +
        "<div class=\"label\">Acceptance Criteria</div>" +
        "<div id=\"pane-acceptancecriteria\"><%= acceptanceCriteria %></div>";
