// @flow

import React, { Component } from 'react';
import CacheableImage from './PostImage';
import copy from '../copy';
import type { Post } from '../types/post';
import type { ContentReportReason } from '../types/content-report';
import apiService from '../services/api-service';

type Props = {
  post: Post,
  isActive: boolean,
  onClose: () => void,
  lang: string
}

type State = {
  didSubmit: boolean,
  error: ?string,
  submitting: boolean
}

class ReportContentModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      didSubmit: false,
      error: null,
      submitting: false
    }
  }
  onSelect = (reason: ContentReportReason) => {
    console.log('selected: ', reason);
    apiService.post(`/posts/${this.props.post.id}/flags`, { post_flag: {
      user_reason: reason
    }})
      .then((res) => {
        this.setState({
          didSubmit: true,
          submitting: false
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          submitting: false,
          error: err
        });
      });
  }
  render() {
    const { isActive, onClose, lang } = this.props;
    const arrowCommonClass = 'fa fa-2x';
    const reasons = ['suspiciousOrSpam', 'sensitivePhoto', 'abusiveOrHarmful', 'selfHarmOrSuicide'];
    const promptTitle = copy.report_content_reason_prompt[lang];
    const successTitle = copy.report_content_success[lang];
    console.log('prompt: ', promptTitle);
    return(
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              {this.state.didSubmit ? successTitle : promptTitle}
            </p>
            <button onClick={onClose} className="delete" aria-label="close"></button>
          </header>
          {!this.state.didSubmit && <section className="modal-card-body">
            <ul className='list is-hoverable'>
              {reasons.map((reason) =>
                <ReasonButton reason={reason} lang={lang} onSelect={this.onSelect} />
              )}
            </ul>
          </section>}
          <footer className="modal-card-foot">
            <button className="button" onClick={onClose}>{this.state.didSubmit ? copy.done[lang] : copy.cancel[lang]}</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default ReportContentModal;


// Button
type ReasonButtonProps = {
  reason: ContentReportReason,
  lang: string,
  onSelect: (reason: ContentReportReason) => void
}
const ReasonButton = (props: ReasonButtonProps) => {
  const { lang, reason, onSelect } = props;
  const reasonCopy = copy[`report_content_reason_${props.reason}`][props.lang]
  return (
    <a
      className='list-item'
      onClick={() => onSelect(reason)}
    >
      {reasonCopy}
    </a>
  )
}
